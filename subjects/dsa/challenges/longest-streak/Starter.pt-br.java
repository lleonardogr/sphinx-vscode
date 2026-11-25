void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] days = new int[n];
    for (int i = 0; i < n; i++) {
        days[i] = Integer.parseInt(parts[i]);
    }

    // TODO: ache a maior sequência de dias seguidos com um HashSet
}
