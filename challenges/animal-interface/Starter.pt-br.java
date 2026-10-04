// TODO: crie uma interface Animal com dois métodos: String name() e String sound()

// TODO: crie as classes Dog, Cat, Cow e Duck que implementam Animal

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] types = IO.readln().trim().split(" ");
    // TODO: crie um array Animal[] com espaço para n animais

    for (int i = 0; i < n; i++) {
        String type = types[i];
        // TODO: crie o animal certo para este tipo e guarde no array
    }

    // TODO: percorra o array e imprima o que cada animal diz
}
