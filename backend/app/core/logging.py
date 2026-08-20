import logging
import sys
from app.core.config import settings

def setup_logging():
    log_format = "%(asctime)s - [%(levelname)s] - [%(name)s] - %(message)s"
    level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    
    logging.basicConfig(
        level=level,
        format=log_format,
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Silence noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("pdfminer").setLevel(logging.ERROR)
    
    logger = logging.getLogger("veridexa")
    logger.setLevel(level)
    return logger

logger = setup_logging()
