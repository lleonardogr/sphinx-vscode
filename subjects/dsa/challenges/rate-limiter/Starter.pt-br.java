void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    int w = Integer.parseInt(first[1]);
    int limit = Integer.parseInt(first[2]);
    String[] parts = IO.readln().trim().split(" +");
    int[] times = new int[n];
    for (int i = 0; i < n; i++) {
        times[i] = Integer.parseInt(parts[i]);
    }

    // TODO: ordene os instantes, ache a janela mais movimentada com dois ponteiros e depois simule o limitador
}
