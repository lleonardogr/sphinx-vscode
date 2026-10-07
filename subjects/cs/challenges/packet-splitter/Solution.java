void main() {
    String[] parts = IO.readln().trim().split(" ");
    long message = Long.parseLong(parts[0]);
    long packetSize = Long.parseLong(parts[1]);
    long header = Long.parseLong(parts[2]);
    long payload = packetSize - header;
    if (payload <= 0) {
        IO.println("Header too big");
        return;
    }
    long packets = (message + payload - 1) / payload;
    long last = message - (packets - 1) * payload + header;
    IO.println("Packets: " + packets);
    IO.println("Last packet: " + last + " bytes");
    IO.println("Total sent: " + (message + packets * header) + " bytes");
}
