int[] readList() {
    int count = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] list = new int[count];
    for (int i = 0; i < count; i++) {
        list[i] = Integer.parseInt(parts[i]);
    }
    return list;
}

boolean inOrder(int[] list) {
    for (int i = 1; i < list.length; i++) {
        if (list[i] < list[i - 1]) {
            return false;
        }
    }
    return true;
}

void main() {
    int[] a = readList();
    int[] b = readList();
    if (!inOrder(a)) {
        IO.println("List A is not sorted");
        return;
    }
    if (!inOrder(b)) {
        IO.println("List B is not sorted");
        return;
    }
    StringJoiner merged = new StringJoiner(" ");
    int i = 0;
    int j = 0;
    int comparisons = 0;
    while (i < a.length && j < b.length) {
        comparisons++;
        if (a[i] <= b[j]) {
            merged.add(String.valueOf(a[i++]));
        } else {
            merged.add(String.valueOf(b[j++]));
        }
    }
    while (i < a.length) {
        merged.add(String.valueOf(a[i++]));
    }
    while (j < b.length) {
        merged.add(String.valueOf(b[j++]));
    }
    IO.println(merged);
    IO.println("Comparisons: " + comparisons);
}
