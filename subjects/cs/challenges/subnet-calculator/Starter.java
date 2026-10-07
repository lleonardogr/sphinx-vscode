void main() {
    String[] input = IO.readln().trim().split("/"); // for example ["192.168.1.130", "26"]
    String[] parts = input[0].split("\\.");
    int prefix = Integer.parseInt(input[1]);

    // TODO: turn the address into one number, find the block it is in, and print the five lines
}
