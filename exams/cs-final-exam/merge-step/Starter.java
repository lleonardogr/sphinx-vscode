int[] readList() {
    int count = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] list = new int[count];
    for (int i = 0; i < count; i++) {
        list[i] = Integer.parseInt(parts[i]);
    }
    return list;
}

void main() {
    int[] a = readList();
    int[] b = readList();
    // TODO: check that both lists are sorted, then merge them and count the comparisons
}
