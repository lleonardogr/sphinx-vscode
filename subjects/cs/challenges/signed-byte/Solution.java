void main() {
    String bits = IO.readln().trim();
    int value = 0;
    int place = 128;
    for (int i = 0; i < 8; i++) {
        if (bits.charAt(i) == '1') {
            value += i == 0 ? -place : place;
        }
        place /= 2;
    }
    IO.println(value);
}
