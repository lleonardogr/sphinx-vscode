// Devolve os números separados por espaços, como "1 2 3".
String join(int[] a) {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < a.length; i++) {
        if (i > 0) sb.append(' ');
        sb.append(a[i]);
    }
    return sb.toString();
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }

    // TODO: ordene o array com bubble sort, imprimindo depois de cada passada que trocou algo
}
