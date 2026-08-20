from typing import Optional, List
from datetime import datetime, timezone
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.processing_job import ProcessingJob, JobStatus

class ProcessingRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, job_id: str) -> Optional[ProcessingJob]:
        query = select(ProcessingJob).where(ProcessingJob.id == job_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def create(self, job: ProcessingJob) -> ProcessingJob:
        self.session.add(job)
        await self.session.commit()
        await self.session.refresh(job)
        return job

    async def update_status(
        self,
        job_id: str,
        status: JobStatus,
        stage: str,
        progress: int,
        product_id: Optional[str] = None,
        error_details: Optional[str] = None
    ) -> Optional[ProcessingJob]:
        job = await self.get_by_id(job_id)
        if not job:
            return None
        
        job.status = status
        job.stage = stage
        job.progress = progress
        if product_id:
            job.product_id = product_id
        if error_details:
            job.error_details = error_details
        if status in [JobStatus.COMPLETED, JobStatus.FAILED]:
            job.completed_at = datetime.now(timezone.utc)
            
        await self.session.commit()
        await self.session.refresh(job)
        return job

    async def list_recent(self, limit: int = 10) -> List[ProcessingJob]:
        query = select(ProcessingJob).order_by(desc(ProcessingJob.created_at)).limit(limit)
        result = await self.session.execute(query)
        return list(result.scalars().all())
