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
    // TODO: confira se as duas listas estão ordenadas e depois intercale-as contando as comparações
}
