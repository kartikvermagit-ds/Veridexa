from app.db.database import engine, Base, AsyncSessionLocal
from app.db.sample_seeds import seed_sample_products
from app.core.logging import logger

async def init_db():
    logger.info("Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as session:
        await seed_sample_products(session)
    logger.info("Database initialization completed successfully.")

if __name__ == "__main__":
    import asyncio
    asyncio.run(init_db())
