#include "huffman.h"
#include <fstream>
#include <sstream>
#include <iostream>

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <input file> <output file>" << std::endl;
        return 1;
    }

    std::ifstream inputFile(argv[1], std::ios::binary);
    std::ofstream outputFile(argv[2], std::ios::binary);

    if (!inputFile.is_open() || !outputFile.is_open()) {
        std::cerr << "Error opening file!" << std::endl;
        return 1;
    }

    std::stringstream buffer;
    buffer << inputFile.rdbuf();
    std::string encodedData = buffer.str();

    HuffmanCoding huffman;
    std::string decodedData = huffman.decompress(encodedData);

    outputFile << decodedData;
    inputFile.close();
    outputFile.close();

    return 0;
}
