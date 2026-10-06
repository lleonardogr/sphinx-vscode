long bytes(long amount, String unit) {
    long factor = switch (unit) {
        case "B" -> 1L;
        case "KB" -> 1_000L;
        case "MB" -> 1_000_000L;
        case "GB" -> 1_000_000_000L;
        case "TB" -> 1_000_000_000_000L;
        case "KiB" -> 1L << 10;
        case "MiB" -> 1L << 20;
        case "GiB" -> 1L << 30;
        case "TiB" -> 1L << 40;
        default -> -1L;
    };
    return factor < 0 ? -1 : amount * factor;
}

long bitsPerSecond(long amount, String unit) {
    long factor = switch (unit) {
        case "bps" -> 1L;
        case "Kbps" -> 1_000L;
        case "Mbps" -> 1_000_000L;
        case "Gbps" -> 1_000_000_000L;
        default -> -1L;
    };
    return factor < 0 ? -1 : amount * factor;
}

void main() {
    String[] size = IO.readln().trim().split(" ");
    String[] speed = IO.readln().trim().split(" ");
    long bytes = bytes(Long.parseLong(size[0]), size[1]);
    if (bytes < 0) {
        IO.println("Invalid unit: " + size[1]);
        return;
    }
    long bps = bitsPerSecond(Long.parseLong(speed[0]), speed[1]);
    if (bps < 0) {
        IO.println("Invalid unit: " + speed[1]);
        return;
    }
    long seconds = (bytes * 8 + bps - 1) / bps;
    IO.println(String.format("Time: %d:%02d:%02d", seconds / 3600, seconds % 3600 / 60, seconds % 60));
}
