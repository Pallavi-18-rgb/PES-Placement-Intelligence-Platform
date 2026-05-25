# Internship Assignment: Agentic Workflows & Model Selection

## TASK 3: Research on Agentic Authorization using LangGraph

### 1. Key Concepts of LangGraph
LangGraph is a robust framework built on top of LangChain for creating stateful, multi-actor, and cyclical applications using Large Language Models (LLMs). It models complex agentic behaviors as graphs.
* **State:** A shared data structure (often a `TypedDict`) passed between nodes. Every action updates this state, providing a persistent memory trace of the workflow.
* **Nodes:** The "workers." These are Python functions or LLM-driven agents that take the current state, perform a specialized task (e.g., risk analysis, database query), and return a state update.
* **Edges & Conditional Routing:** The control flow. Edges connect nodes, and conditional edges use logic (or LLM reasoning) to determine the next node based on the current state.
* **Memory & Checkpointing:** LangGraph can pause execution, save the exact state to a database (checkpoint), and wait for an external trigger (like human approval) before resuming.

### 2. How Agentic Flows Work
In traditional software, execution is linear. In agentic flows, execution is dynamic based on LLM reasoning. The flow typically follows a ReAct (Reasoning + Acting) loop:
1. **Observation:** The Agent Node reads the current State.
2. **Reasoning:** The LLM decides if it has enough information to fulfill its objective or if it needs to use a tool.
3. **Action:** If a tool is needed (e.g., searching a database for compliance rules), it routes to a Tool Node.
4. **Update:** The Tool Node executes the search, updates the State, and routes back to the Agent Node to re-evaluate. This cycle continues until the objective is achieved.

### 3. Agentic Authorization & Potential Use Cases
Agentic authorization moves beyond static Role-Based Access Control (RBAC). It uses context, history, and reasoning to dynamically authorize requests.

* **Healthcare Data Access (HIPAA Workflow):** 
  * *Scenario:* A researcher requests access to patient records. 
  * *Flow:* The agent checks the researcher's certification validity, queries the data classification level, and assesses the justification text. If standard, it auto-approves. If highly sensitive, it uses LangGraph's *checkpointing* to pause the workflow and route an alert to the Ethics Board for human-in-the-loop approval.
* **Financial Transaction Approvals:** 
  * *Scenario:* Approving a B2B invoice payout.
  * *Flow:* The agent validates the invoice against historical POs. If the amount deviates by >10% of historical averages, it dynamically routes the authorization request to the CFO's queue, avoiding a rigid, hardcoded $ threshold.
* **Enterprise Cloud Infrastructure Provisioning:** 
  * *Scenario:* A developer requests a massive GPU cluster. 
  * *Flow:* The agent reviews the project's current cloud budget, the developer's project assignment, and current cloud capacity before authorizing the API call to AWS/Azure.

---

## TASK 4: Model Evaluation and Selection

Based on the `cheahjs/free-llm-api-resources` repository and the requirement for reliable models that support research tasks and web search capabilities, the following three models from different providers have been selected.

### 1. Provider: Anthropic
* **Model:** Claude 3.5 Sonnet
* **Justification:** Claude 3.5 Sonnet is a leading model known for its exceptional coding, reasoning, and instruction-following capabilities. It is highly reliable for intricate agentic workflows and provides an optimal balance of speed and intelligence.
* **Strengths:** 
  * Outstanding capability in understanding complex instructions and generating highly structured, precise outputs.
  * Advanced reasoning abilities perfectly suited for complex decision-making in LangGraph ReAct loops.
  * Excellent context retention and detail-oriented processing over long conversational histories.

### 2. Provider: Meta (via Groq)
* **Model:** Llama 3.1 70B
* **Justification:** Llama 3.1 70B is an open-weights model that provides top-tier performance, comparable to leading proprietary models. Hosted on Groq's LPU architecture, it offers blistering inference speeds essential for rapid, multi-step agentic tasks.
* **Strengths:**
  * Exceptional open-source reasoning capabilities suitable for robust tool use.
  * Ultra-fast inference speeds on Groq, minimizing latency in complex, multi-node agentic graphs.
  * Strong alignment and safe response generation for reliable real-world authorization tasks.

### 3. Provider: OpenAI
* **Model:** GPT-4o
* **Justification:** GPT-4o is a highly capable multimodal model that excels in robust reasoning and API-driven task execution. Its widespread adoption makes it an industry standard for agentic architectures.
* **Strengths:**
  * Superior performance in function calling and strictly adhering to complex schemas required by agentic frameworks.
  * Highly versatile and capable of handling complex "Supervisor" tasks in authorization workflows.
  * Excellent broad knowledge base and reasoning skills for evaluating varying edge cases.
