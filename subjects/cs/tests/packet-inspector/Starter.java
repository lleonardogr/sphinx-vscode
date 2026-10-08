void main() {
    String[] hex = IO.readln().trim().split(" ");
    int[] bytes = new int[hex.length];
    for (int i = 0; i < hex.length; i++) {
        bytes[i] = Integer.parseInt(hex[i], 16);
    }

    // TODO: read the IPv4 header fields from bytes, check the checksum, then the UDP part
}
