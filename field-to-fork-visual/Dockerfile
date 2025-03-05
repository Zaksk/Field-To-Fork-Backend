FROM python:3.10-slim
WORKDIR /app 
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5000
COPY . /app
CMD python ./visuals.py

