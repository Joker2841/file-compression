#ifndef HUFFMAN_H
#define HUFFMAN_H

#include <string>
#include <unordered_map>

namespace Huffman {

    class HuffmanNode {
    public:
        char data;
        unsigned frequency;
        HuffmanNode* left, * right;

        HuffmanNode(char data, unsigned frequency) : data(data), frequency(frequency), left(nullptr), right(nullptr) {}
    };

    class HuffmanCoding {
    private:
        HuffmanNode* root;

    public:
        HuffmanCoding();
        ~HuffmanCoding();

        std::string compress(const std::string& text);
        std::string decompress(const std::string& compressedText);

    private:
        void buildHuffmanTree(const std::unordered_map<char, unsigned>& freqMap);
        void encode(HuffmanNode* root, const std::string& currentCode, std::unordered_map<char, std::string>& huffmanCodes);
        void decode(HuffmanNode* root, int& index, const std::string& encodedText, std::string& decodedText);
        void deleteTree(HuffmanNode* node);
    };

} // namespace Huffman

#endif // HUFFMAN_H
