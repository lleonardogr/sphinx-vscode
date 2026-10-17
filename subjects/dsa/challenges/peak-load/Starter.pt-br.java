void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    int k = Integer.parseInt(first[1]);
    String[] parts = IO.readln().trim().split(" +");
    int[] load = new int[n];
    for (int i = 0; i < n; i++) {
        load[i] = Integer.parseInt(parts[i]);
    }

    // TODO: mantenha o pico de cada janela com um deque e ache a janela com o menor pico
}
