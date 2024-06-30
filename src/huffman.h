#ifndef HUFFMAN_H
#define HUFFMAN_H

#include <string>
#include <unordered_map>
#include <queue>
#include <vector>

struct Node {
    char ch;
    int freq;
    Node* left;
    Node* right;

    Node(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
};

struct compare {
    bool operator()(Node* l, Node* r) {
        return l->freq > r->freq;
    }
};

class HuffmanCoding {
public:
    void buildFrequencyTable(const std::string& data);
    void buildHuffmanTree();
    void generateCodes(Node* root, const std::string& str);
    std::string compress(const std::string& data);
    std::string decompress(const std::string& encodedData);

private:
    std::unordered_map<char, int> frequencyTable;
    std::unordered_map<char, std::string> huffmanCodes;
    std::unordered_map<std::string, char> reverseHuffmanCodes;
    Node* root;
};

#endif // HUFFMAN_H
