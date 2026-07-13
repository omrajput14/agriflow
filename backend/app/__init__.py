# This file makes 'app' a proper Python package.
# Load .env before any module reads os.getenv at import time.
from dotenv import load_dotenv
load_dotenv()
