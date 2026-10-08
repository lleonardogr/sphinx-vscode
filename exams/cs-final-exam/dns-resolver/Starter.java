void main() {
    int r = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < r; i++) {
        String[] record = IO.readln().trim().split(" "); // name, type, value
        // TODO: store the record
    }
    int q = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < q; i++) {
        String name = IO.readln().trim().toLowerCase();
        // TODO: follow the CNAMEs and print the chain with the addresses, NXDOMAIN or LOOP
    }
}
