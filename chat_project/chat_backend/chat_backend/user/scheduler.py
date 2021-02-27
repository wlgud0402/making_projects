import sched
import time
import threading
from chat.models import Room


def db_remove(room_id):
    print(f"{room_id}번 방의 이름, 상태, 비밀번호, is_private를 초기화합니다 => IDLE상태로 변경")
    room = Room.objects.get(id=room_id)
    room.name = "NULL"
    room.status = "IDLE"
    room.password = "NULL"
    is_private = False
    room.save()


class RoomScheduler:
    def __init__(self):
        self.event_maps = {}
        self.scheduler = sched.scheduler(time.time, time.sleep)

    def scheduleRemove(self, room_id):
        print("scheduleRemove", room_id)
        event = self.scheduler.enter(5, 1, db_remove, argument=(room_id,))

        self.event_maps[room_id] = event

        def runScheduler():
            self.scheduler.run()

        thread = threading.Thread(target=runScheduler)
        thread.start()

    def cancelRemove(self, room_id):
        print("cancelRemove", room_id)

        if room_id in self.event_maps:
            event = self.event_maps.get(room_id)
            self.scheduler.cancel(event)


roomScheduler = RoomScheduler()
# roomScheduler.scheduleRemove('3')  # room_id
# roomScheduler.cancelRemove('3')
