void main() {
    int n = Integer.parseInt(IO.readln().trim());
    for (int row = 1; row <= n; row++) {
        StringBuilder line = new StringBuilder();
        for (int i = 1; i <= row; i++) {
            line.append(i == 1 ? "" : " ").append(i);
        }
        for (int i = row - 1; i >= 1; i--) {
            line.append(" ").append(i);
        }
        IO.println(line);
    }
}
