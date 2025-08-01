import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/conversations', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/conversations/${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      return response.json();
    },
    enabled: !!user,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/messages/project', selectedConversation],
    queryFn: async () => {
      const response = await fetch(`/api/messages/project/${selectedConversation}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    enabled: !!selectedConversation,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { projectId: string; receiverId: string; content: string }) => {
      const response = await apiRequest("POST", "/api/messages", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages/project', selectedConversation] });
      setNewMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const conversation = conversations.find((c: any) => c.projectId === selectedConversation);
    if (!conversation) return;

    sendMessageMutation.mutate({
      projectId: selectedConversation,
      receiverId: conversation.otherUserId,
      content: newMessage.trim(),
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4 p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view messages.</p>
          <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-blue-700">
            Go to Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: "600px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* Conversations List */}
            <div className="lg:col-span-1 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
              </div>
              <div className="overflow-y-auto" style={{ height: "calc(600px - 80px)" }}>
                {conversationsLoading ? (
                  <div className="p-4 text-center text-gray-600">Loading conversations...</div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-600">
                    <p className="mb-4">No conversations yet</p>
                    <p className="text-sm">Messages will appear here when you start communicating with contractors or homeowners.</p>
                  </div>
                ) : (
                  conversations.map((conversation: any) => (
                    <div
                      key={conversation.projectId}
                      className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                        selectedConversation === conversation.projectId ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.projectId)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 text-sm">U</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Project #{conversation.projectId.slice(0, 8)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(conversation.lastMessage.createdAt!).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Chat Interface */}
            <div className="lg:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">P</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Project #{selectedConversation.slice(0, 8)}
                      </h4>
                      <p className="text-sm text-gray-600">Renovation Project</p>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: "calc(600px - 160px)" }}>
                    {messagesLoading ? (
                      <div className="text-center text-gray-600">Loading messages...</div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-600">
                        <p>No messages yet</p>
                        <p className="text-sm mt-2">Start the conversation below</p>
                      </div>
                    ) : (
                      messages.map((message: any) => (
                        <div
                          key={message.id}
                          className={`flex items-start space-x-3 ${
                            message.senderId === user.id ? 'justify-end' : ''
                          }`}
                        >
                          {message.senderId !== user.id && (
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-600 text-xs">C</span>
                            </div>
                          )}
                          <div className="flex-1 text-right">
                            <div
                              className={`rounded-lg px-4 py-2 max-w-md inline-block ${
                                message.senderId === user.id
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(message.createdAt!).toLocaleString()}
                            </p>
                          </div>
                          {message.senderId === user.id && (
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-600 text-xs">Y</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSendMessage();
                            }
                          }}
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        className="bg-primary hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                    <p>Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
