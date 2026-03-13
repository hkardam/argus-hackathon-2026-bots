package com.bots.hackathon.document;

import java.util.Map;

public interface TemplateRenderer {

  /**
   * Renders a template with the given data. TODO: Implement with a template engine (e.g.,
   * Thymeleaf, FreeMarker).
   */
  String render(String templateName, Map<String, Object> data);
}
