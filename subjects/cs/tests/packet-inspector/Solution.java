int[] bytes;

// Two bytes as one number, most significant first (network byte order).
int word(int at) {
    return bytes[at] << 8 | bytes[at + 1];
}

String address(int at) {
    return bytes[at] + "." + bytes[at + 1] + "." + bytes[at + 2] + "." + bytes[at + 3];
}

void main() {
    String[] hex = IO.readln().trim().split("\\s+");
    bytes = new int[hex.length];
    for (int i = 0; i < hex.length; i++) {
        bytes[i] = Integer.parseInt(hex[i], 16);
    }
    if (bytes[0] >> 4 != 4) {
        IO.println("Not IPv4");
        return;
    }
    int headerLength = (bytes[0] & 0x0F) * 4;
    int totalLength = word(2);
    int protocol = bytes[9];
    String name = switch (protocol) {
        case 1 -> "ICMP";
        case 6 -> "TCP";
        case 17 -> "UDP";
        default -> "Unknown";
    };
    int sum = 0;
    for (int i = 0; i < headerLength; i += 2) {
        sum += word(i);
        sum = (sum & 0xFFFF) + (sum >> 16);
    }
    IO.println("Version: 4");
    IO.println("Header length: " + headerLength + " bytes");
    IO.println("Total length: " + totalLength + " bytes");
    IO.println("TTL: " + bytes[8]);
    IO.println("Protocol: " + name + " (" + protocol + ")");
    IO.println("Source: " + address(12));
    IO.println("Destination: " + address(16));
    IO.println("Checksum: 0x%04X %s".formatted(word(10), sum == 0xFFFF ? "(valid)" : "(invalid)"));
    if (protocol == 17) {
        IO.println("Ports: " + word(headerLength) + " -> " + word(headerLength + 2));
        StringBuilder text = new StringBuilder();
        for (int i = headerLength + 8; i < totalLength; i++) {
            text.append(bytes[i] >= 32 && bytes[i] <= 126 ? (char) bytes[i] : '.');
        }
        IO.println("Payload: " + (text.isEmpty() ? "(empty)" : text));
    }
}
