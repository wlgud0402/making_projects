import sched
import time
import threading


def db_remove(roomId):
    print("roomId db 삭제", roomId)


class RoomScheduler:
    def __init__(self):
        self.event_maps = {}
        self.scheduler = sched.scheduler(time.time, time.sleep)

    def scheduleRemove(self, roomId):
        print("scheduleRemove", roomId)
        event = self.scheduler.enter(3, 1, db_remove, argument=(roomId,))

        self.event_maps[roomId] = event

        def runScheduler():
            self.scheduler.run()

        thread = threading.Thread(target=runScheduler)
        thread.start()

    def cancelRemove(self, roomId):
        print("cancelRemove", roomId)

        if roomId in self.event_maps:
            event = self.event_maps.get(roomId)
            self.scheduler.cancel(event)


roomScheduler = RoomScheduler()
# roomScheduler.scheduleRemove('3')  # roomId
# roomScheduler.cancelRemove('3')
