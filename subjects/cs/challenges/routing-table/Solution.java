long toNumber(String dotted) {
    long value = 0;
    for (String part : dotted.split("\\.")) {
        value = value * 256 + Integer.parseInt(part);
    }
    return value;
}

void main() {
    int r = Integer.parseInt(IO.readln().trim());
    long[] networks = new long[r];
    int[] prefixes = new int[r];
    String[] hops = new String[r];
    for (int i = 0; i < r; i++) {
        String[] route = IO.readln().trim().split(" ");
        String[] cidr = route[0].split("/");
        networks[i] = toNumber(cidr[0]);
        prefixes[i] = Integer.parseInt(cidr[1]);
        hops[i] = route[1];
    }
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String address = IO.readln().trim();
        long a = toNumber(address);
        int best = -1;
        for (int k = 0; k < r; k++) {
            int shift = 32 - prefixes[k];
            if ((a >> shift) == (networks[k] >> shift) && (best < 0 || prefixes[k] > prefixes[best])) {
                best = k;
            }
        }
        IO.println(address + " -> " + (best < 0 ? "no route" : hops[best]));
    }
}
