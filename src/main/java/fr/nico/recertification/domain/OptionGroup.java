package fr.nico.recertification.domain;

public class OptionGroup {

	private long id;
	
	private String name;
	
	private String type;
	
	public OptionGroup() {
		// TODO Auto-generated constructor stub
	}
	
	

	public OptionGroup(long id, String name, String type) {
		super();
		this.id = id;
		this.name = name;
		this.type = type;
	}



	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	
	
}
