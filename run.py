from huggingface_hub import hf_hub_download
# repo and filename must match what the HF repo exposes (example placeholders)
repo_id = "ibm-granite/granite-3.2-2b-instruct"
# find a GGUF filename on the repo or a conversion repo, this is an example placeholder:
gguf_name = "granite-3.2-2b.gguf"  
path = hf_hub_download(repo_id=repo_id, filename=gguf_name)
print("Downloaded to:", path)

