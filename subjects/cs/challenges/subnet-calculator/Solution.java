String dotted(long n) {
    return (n >> 24) + "." + ((n >> 16) & 255) + "." + ((n >> 8) & 255) + "." + (n & 255);
}

void main() {
    String[] input = IO.readln().trim().split("/");
    String[] parts = input[0].split("\\.");
    int prefix = Integer.parseInt(input[1]);
    long address = 0;
    for (String part : parts) {
        address = address * 256 + Integer.parseInt(part);
    }
    long size = 1L << (32 - prefix);
    long network = address - address % size;
    long broadcast = network + size - 1;
    IO.println("Network: " + dotted(network));
    IO.println("Broadcast: " + dotted(broadcast));
    IO.println("First host: " + dotted(network + 1));
    IO.println("Last host: " + dotted(broadcast - 1));
    IO.println("Hosts: " + (size - 2));
}
