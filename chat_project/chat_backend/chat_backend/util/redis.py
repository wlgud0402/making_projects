import redis
import redis_server
import json

r = redis.Redis(host='localhost', port=6379, db=0)
