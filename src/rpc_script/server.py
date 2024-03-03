import grpc
import chat_pb2
import chat_pb2_grpc
from concurrent import futures

class ChatServicer(chat_pb2_grpc.ChatServicer):
    def __init__(self):
        self.messages = []

    def SendMessage(self, request, context):
        message = chat_pb2.Message(user=request.user, text=request.text)
        self.messages.append(message)
        return message

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    chat_pb2_grpc.add_ChatServicer_to_server(ChatServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server started, listening on port 50051...")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
