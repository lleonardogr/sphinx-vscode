void main() {
    int n = Integer.parseInt(IO.readln().trim());
    int[] starts = new int[n];
    int[] ends = new int[n];
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" +");
        starts[i] = Integer.parseInt(parts[0]);
        ends[i] = starts[i] + Integer.parseInt(parts[1]);
    }
    Arrays.sort(starts);
    Arrays.sort(ends);

    int blocks = 0;
    long busy = 0;
    long longestGap = 0;
    int blockStart = starts[0];
    for (int i = 0; i < n; i++) {
        boolean last = i == n - 1;
        if (last || starts[i + 1] > ends[i]) {
            blocks++;
            busy += ends[i] - blockStart;
            if (!last) {
                longestGap = Math.max(longestGap, starts[i + 1] - ends[i]);
                blockStart = starts[i + 1];
            }
        }
    }
    IO.println("blocks: " + blocks);
    IO.println("busy: " + busy);
    IO.println("longest free gap: " + longestGap);
}
