void main() {
    int n = Integer.parseInt(IO.readln().trim());
    if ((n & 1) == 0) {
        IO.println("Even");
    } else {
        IO.println("Odd");
    }
}
