# Dockerfile for Django
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# Copy the project files
COPY . /app/

# Expose the port Django will run on
EXPOSE 8000

# Collect static files
RUN python manage.py collectstatic --noinput

# Start the Django server based on the mode
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
