void main() {
    String[] lb = IO.readln().trim().split(" ");
    int lines = Integer.parseInt(lb[0]);
    int blockSize = Integer.parseInt(lb[1]);
    int n = Integer.parseInt(IO.readln().trim());
    String[] addresses = IO.readln().trim().split(" ");
    int[] cache = new int[lines];
    Arrays.fill(cache, -1);
    int hits = 0;
    for (String a : addresses) {
        int address = Integer.parseInt(a);
        int block = address / blockSize;
        int line = block % lines;
        if (cache[line] == block) {
            hits++;
            IO.println(address + " hit");
        } else {
            cache[line] = block;
            IO.println(address + " miss");
        }
    }
    IO.println("Hits: " + hits + "/" + n);
    IO.println("Hit rate: " + String.format("%.1f", 100.0 * hits / n) + "%");
}
