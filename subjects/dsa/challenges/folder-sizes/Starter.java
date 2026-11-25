void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    long limit = Long.parseLong(first[1]);
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" +");
        String path = parts[0];
        long size = Long.parseLong(parts[1]);

        // TODO: add the file to a tree of folders
    }

    // TODO: add the totals up the tree (post-order) and print the five lines
}
