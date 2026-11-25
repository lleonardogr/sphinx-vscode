void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] keys = new int[n];
    for (int i = 0; i < n; i++) {
        keys[i] = Integer.parseInt(parts[i]);
    }

    // TODO: insert the keys into a binary search tree, then print the traversals, the height and the leaves
}
