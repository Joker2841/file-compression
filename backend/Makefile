# Makefile

CXX = g++
CXXFLAGS = -std=c++17 -Iinclude -Isrc
LDFLAGS = -lWs2_32

BIN_DIR = bin
OBJ_DIR = obj

OBJS = $(OBJ_DIR)/huffman.o $(OBJ_DIR)/main.o

$(BIN_DIR)/file_compression_server: $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^ $(LDFLAGS)

$(OBJ_DIR)/%.o: src/%.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $<

.PHONY: clean
clean:
	rm -f $(OBJ_DIR)/*.o $(BIN_DIR)/file_compression_server
