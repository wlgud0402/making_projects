import redis_server
import redis

r = redis.Redis(host='localhost', port=6379, db=0)
r.set('test_result', 'It is working!!!')

bob_r = redis.Redis(host='localhost', port=6379, db=0)
bob_p = bob_r.pubsub()

bob_p.subscribe('classical_music')

alice_r = redis.Redis(host='localhost', port=6379, db=0)
alice_r.publish('classical_music', 'Alice Music')

bob_p.get_message()
new_music = bob_p.get_message()['data']

alice_r.publish('classical_music', 'Alice 2nd Music')

another_music = bob_p.get_message()['data']
print(another_music)


def home(request):
    return HttpResponse("홈으로 잘왔꾼요1!")
