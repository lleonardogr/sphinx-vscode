// TODO: create an interface Animal with two methods: String name() and String sound()

// TODO: create classes Dog, Cat, Cow and Duck that implement Animal

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] types = IO.readln().trim().split(" ");
    // TODO: create an Animal[] array with room for n animals

    for (int i = 0; i < n; i++) {
        String type = types[i];
        // TODO: create the right animal for this type and store it in the array
    }

    // TODO: loop over the array and print what each animal says
}
