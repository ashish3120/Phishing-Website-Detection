# 1. Use official lightweight Python image
FROM python:3.10-slim

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy requirements first (better caching)
COPY requirements.txt .

# 4. Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy project files
COPY src ./src

# 6. Expose port (Render uses 10000)
EXPOSE 10000

# 7. Start FastAPI using uvicorn
CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "10000"]
