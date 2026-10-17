void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    Set<Integer> seen = new HashSet<>();
    Set<Integer> repeated = new HashSet<>();
    for (int i = 0; i < n; i++) {
        int id = Integer.parseInt(parts[i]);
        if (!seen.add(id)) {
            repeated.add(id);
        }
    }
    IO.println(repeated.size());
}
