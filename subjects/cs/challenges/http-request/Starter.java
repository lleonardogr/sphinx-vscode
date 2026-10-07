void main() {
    String requestLine = IO.readln(); // for example GET /index.html HTTP/1.1
    String line = IO.readln();
    while (!line.isEmpty()) {
        // TODO: check the header line and remember the Host

        line = IO.readln();
    }
    // TODO: check the request line, then print the four lines or 400 Bad Request
}
