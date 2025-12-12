from huggingface_hub import hf_hub_download

repo_id = "ibm-granite/granite-3.2-2b-instruct"
file_path = hf_hub_download(repo_id=repo_id, filename="config.json")
print("✅ File downloaded to:", file_path)
