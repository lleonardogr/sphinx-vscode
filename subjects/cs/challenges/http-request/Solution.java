void main() {
    String[] parts = IO.readln().split(" ", -1);
    boolean ok = parts.length == 3 && List.of("GET", "POST", "PUT", "DELETE", "HEAD").contains(parts[0]);
    String host = null;
    int headers = 0;
    String line = IO.readln();
    while (!line.isEmpty()) {
        int colon = line.indexOf(':');
        if (colon < 0) {
            ok = false;
        } else if (line.substring(0, colon).trim().equalsIgnoreCase("Host")) {
            host = line.substring(colon + 1).trim();
        }
        headers++;
        line = IO.readln();
    }
    if (!ok || host == null) {
        IO.println("400 Bad Request");
        return;
    }
    IO.println("Method: " + parts[0]);
    IO.println("Path: " + parts[1]);
    IO.println("Host: " + host);
    IO.println("Headers: " + headers);
}
