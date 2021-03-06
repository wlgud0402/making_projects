import sched
import time
import threading
from chat.models import Room
import redis
import redis_server
import json
from util.redis import r


def db_remove(room_id):
    # print(f"{room_id}번 방의 이름, 상태, 비밀번호, is_private를 초기화합니다 => IDLE상태로 변경")
    room = Room.objects.get(id=room_id)
    room.name = "NULL"
    room.status = "IDLE"
    room.uuid = "NULL"
    room.password = "NULL"
    room.is_private = False
    room.save()
    # r = redis.Redis(host='localhost', port=6379, db=0)
    r.publish('room-refresh', json.dumps({
        'room_id': room_id,
    }))


class RoomScheduler:
    def __init__(self):
        self.event_maps = {}
        self.scheduler = sched.scheduler(time.time, time.sleep)

    def scheduleRemove(self, room_id):
        # print(f"scheduleRemove: {room_id}번방의 상태를 변경중입니다...!!!")
        event = self.scheduler.enter(10, 1, db_remove, argument=(room_id,))

        self.event_maps[room_id] = event

        # print("1111111111111", self.event_maps)

        def runScheduler():
            self.scheduler.run()

        thread = threading.Thread(target=runScheduler)
        thread.start()

    def cancelRemove(self, room_id):
        # print(f"cancelRemove: {room_id}방의 클리닝이 취소되었습니다...")
        if room_id in self.event_maps:
            # print(room_id, "있어서 취소하께")
            event = self.event_maps.get(room_id)
            self.scheduler.cancel(event)


roomScheduler = RoomScheduler()
# roomScheduler.scheduleRemove('3')  # room_id
# roomScheduler.cancelRemove('3')
