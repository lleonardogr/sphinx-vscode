void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] ids = new int[n];
    for (int i = 0; i < n; i++) {
        ids[i] = Integer.parseInt(parts[i]);
    }
    Arrays.sort(ids);
    int repeated = 0;
    int i = 0;
    while (i < n) {
        int j = i;
        while (j < n && ids[j] == ids[i]) {
            j++;
        }
        if (j - i >= 2) {
            repeated++;
        }
        i = j;
    }
    IO.println(repeated);
}
