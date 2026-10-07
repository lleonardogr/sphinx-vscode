void main() {
    int r = Integer.parseInt(IO.readln().trim());
    String[] routes = new String[r];
    for (int i = 0; i < r; i++) {
        routes[i] = IO.readln().trim(); // for example 10.0.0.0/8 Office
    }
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String address = IO.readln().trim();

        // TODO: find the matching route with the longest prefix and print address -> next hop
    }
}
