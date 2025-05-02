import os

import redis
from dotenv import load_dotenv

load_dotenv()

host = os.getenv('REDIS_HOST')
port = os.getenv('REDIS_PORT')
pw= os.getenv('REDIS_PASSWORD')
ssl= os.getenv('REDIS_SSL')

r = redis.Redis(
  host=host,
  port=port,
  password=pw,
  ssl=ssl
)

# r.set('foo', 'bar')
print(r.get('foo'))
    


