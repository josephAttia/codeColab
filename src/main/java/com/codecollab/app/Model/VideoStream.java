package com.codecollab.app.Model;

public class VideoStream {

    private String sender = "Joseph Attia";
    private Byte[] videoStream = null;

    public Byte[] getContent() {
        return videoStream;
    }

    public void setContent(Byte[] content) {
        this.videoStream = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }
}
