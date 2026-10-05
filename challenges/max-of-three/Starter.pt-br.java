// TODO: devolva o maior entre a, b e c
int max(int a, int b, int c) {
    return 0;
}

void main() {
    int t = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < t; i++) {
        String[] p = IO.readln().trim().split(" ");
        IO.println("Max: " + max(Integer.parseInt(p[0]), Integer.parseInt(p[1]), Integer.parseInt(p[2])));
    }
}
